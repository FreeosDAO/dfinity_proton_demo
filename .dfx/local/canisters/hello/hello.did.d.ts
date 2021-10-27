import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'getusers' : () => Promise<string>,
  'greet' : (arg_0: string) => Promise<string>,
  'storeid' : (arg_0: string, arg_1: string) => Promise<string>,
}
