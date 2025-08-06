export const awsConfig = {
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
  cognito: {
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID!,
    clientId: process.env.REACT_APP_COGNITO_CLIENT_ID!,
  },
  s3: {
    bucket: process.env.REACT_APP_S3_BUCKET!,
    cloudFrontDomain: process.env.REACT_APP_CLOUDFRONT_DOMAIN!,
  },
  dynamodb: {
    tables: {
      users: process.env.REACT_APP_USERS_TABLE!,
      posts: process.env.REACT_APP_POSTS_TABLE!,
      follows: process.env.REACT_APP_FOLLOWS_TABLE!,
      likes: process.env.REACT_APP_LIKES_TABLE!,
      comments: process.env.REACT_APP_COMMENTS_TABLE!,
    },
  },
   api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL!,
  },
};