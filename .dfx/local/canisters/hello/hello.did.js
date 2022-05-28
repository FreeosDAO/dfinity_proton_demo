export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'claim' : IDL.Func([IDL.Text], [IDL.Text], []),
    'fetchuser' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_balance' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getnumusers' : IDL.Func([], [IDL.Text], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'inc' : IDL.Func([], [IDL.Principal], []),
    'storeuser' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    'switchuser' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
