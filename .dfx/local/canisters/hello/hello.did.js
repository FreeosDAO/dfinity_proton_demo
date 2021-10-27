export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getusers' : IDL.Func([], [IDL.Text], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'storeid' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
