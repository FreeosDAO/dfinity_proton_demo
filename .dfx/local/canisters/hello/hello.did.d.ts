import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'claim' : ActorMethod<[string], string>,
  'fetchuser' : ActorMethod<[string], string>,
  'get_balance' : ActorMethod<[string], string>,
  'getnumusers' : ActorMethod<[], string>,
  'greet' : ActorMethod<[string], string>,
  'inc' : ActorMethod<[], Principal>,
  'storeuser' : ActorMethod<[string, string, string], string>,
  'switchuser' : ActorMethod<[string, string], string>,
}
