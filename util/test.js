
var scopes = ['admin.test'];
var perms = ['admin.test', 'admin.create'];

/*function compress(string, acc) {
    var pieces = string
        .split('.');
    var next = pieces.shift();
    if (next.length)
        compress(pieces.join('.'), acc.concat(next).join('.'))
    return acc;
};
*/

function compress(string) {
    var old_pieces = [];
    return string
        .split('.')
        .reduce((acc, piece) => {
            old_pieces.push(piece);
            return [...acc, old_pieces.join('.')];
        }, []);
};

console.log(compress('admin.test.dev'));
    

var all_perms = [...new Set(perms
        .reduce((acc, perm) => 
            perm
                .split('.')
                .reduce((acc, branch) => {
                    console.log(acc);
                    console.log(branch);
                    return [...acc, [acc[acc.length - 1], branch].join('.')];
                }), []
        )
    )
];

console.log(all_perms);

var missing = scopes.reduce((acc, scope) =>
    all_perms.includes(scope) ?
        acc : [...acc, scope],
    []
);

console.log(missing);


    
