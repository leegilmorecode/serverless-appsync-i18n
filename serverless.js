/* eslint-disable no-undef */
const { getNoteTypes } = require("./src/note-types/get-note-types");
const { getErrorTypes } = require("./src/error-types/get-error-types");
const { getErrorMessages } = require("./src/error-messages/get-error-messages");

const serverlessConfiguration = {
  service: "serverless-appsync-i18n",
  frameworkVersion: "2",
  plugins: ["serverless-appsync-plugin"],
  provider: {
    name: "aws",
    stage: "${opt:stage, 'develop'}",
    region: "${opt:region, 'eu-west-1'}",
    runtime: "nodejs14.x",
    lambdaHashingVersion: "20201221",
  },
  custom: {
    tableName: "note-table-${self:provider.stage}",
    appSync: {
      name: "appsync-endpoint",
      authenticationType: "API_KEY",
      schema: "schema.graphql",
      apiKeys: [
        {
          description: "api_key",
          expiresAfter: "30d",
        },
      ],
      logConfig: {
        loggingRoleArn: {
          "Fn::GetAtt": ["AppSyncLoggingServiceRole", "Arn"],
        },
        level: "ALL",
        excludeVerboseContent: false,
      },
      mappingTemplates: [
        {
          dataSource: "NotesTableDS",
          type: "Query",
          field: "allNotes",
          request: "all-notes/all-notes-request.vtl",
          response: "all-notes/all-notes-response.vtl",
        },
        {
          dataSource: "NotesTableDS",
          type: "Query",
          field: "getNote",
          request: "get-note/get-note-request.vtl",
          response: "common/common-response.vtl",
        },
        {
          dataSource: "None",
          type: "Query",
          field: "getNoteTypes",
          request: "get-note-types/get-note-types-request.vtl",
          response: "common/common-response.vtl",
        },
        {
          dataSource: "NotesTableDS",
          type: "Mutation",
          field: "saveNote",
          request: "save-note/save-note-request.vtl",
          response: "common/common-response.vtl",
        },
      ],
      dataSources: [
        {
          type: "AMAZON_DYNAMODB",
          name: "NotesTableDS",
          description: "DynamoDB Notes Table",
          config: {
            tableName: "${self:custom.tableName}",
            serviceRoleArn: {
              "Fn::GetAtt": ["AppSyncDynamoDBServiceRole", "Arn"],
            },
          },
        },
        {
          type: "NONE",
          name: "None",
        },
      ],
      substitutions: {
        ...getNoteTypes(process.env.LOCALE),
        ...getErrorTypes(process.env.LOCALE),
        ...getErrorMessages(process.env.LOCALE),
        // this could also be regexes passed through for validation of inputs
        // or enum values
        // and if pulled from an npm package can be used in your lambdas etc too :)
      },
      xrayEnabled: true,
    },
  },
  resources: {
    Resources: {
      NoteDynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "noteId",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "noteId",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: "${self:custom.tableName}",
        },
      },
      AppSyncDynamoDBServiceRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "Dynamo-appsync-serviceRole",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: ["appsync.amazonaws.com"],
                },
                Action: ["sts:AssumeRole"],
              },
            ],
          },
          Policies: [
            {
              PolicyName: "Dynamo-appsync-Policy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "dynamodb:GetItem",
                      "dynamodb:PutItem",
                      "dynamodb:Scan",
                    ],
                    Resource: [
                      {
                        "Fn::GetAtt": ["NoteDynamoDBTable", "Arn"],
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
      AppSyncLoggingServiceRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: ["appsync.amazonaws.com"],
                },
                Action: ["sts:AssumeRole"],
              },
            ],
          },
          Policies: [
            {
              PolicyName: "LogRolePolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["logs:Create*", "logs:PutLogEvents"],
                    Resource: ["arn:aws:logs:*:*:*"],
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
