export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getuser' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getusers' : IDL.Func([], [IDL.Text], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'storeid' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
