import logger from '@src/lib/createLogger';

const log = logger('handleGraphqlError');

export interface GraphqlErrorResponse {
  errors: {
    message: string;
    locations: {
      line: number;
      column: number;
    }[];
    path: string[];
  }[];
}

export default (res: GraphqlErrorResponse | Error): { message: string } => {
  if (res instanceof Error) {
    return res;
  }

  for (const err of res.errors) {
    log(err);
  }

  return res.errors[0];
};
