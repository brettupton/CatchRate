var fs = require('fs')
// const F = Math.min((Math.floor((pokemon.HPMax * 255) / ballRate)) / Math.max((Math.floor(hp / 4)), 1), 255)

const genftable = () => {

    const FTable = {
        "Great": {},
        "Other": {}
    }

    for (let max = 1; max < 256; max++) {
        const maxString = max.toString()
        FTable["Great"][maxString] = []
        for (let curr = 1; curr < 256; curr++) {
            FTable["Great"][maxString].push(Math.min((Math.floor((max * 255) / 8)) / Math.max((Math.floor(curr / 4)), 1), 255))
        }
    }

    for (let max = 1; max < 256; max++) {
        const maxString = max.toString()
        FTable["Other"][maxString] = []
        for (let curr = 1; curr < 256; curr++) {
            FTable["Other"][maxString].push(Math.min((Math.floor((max * 255) / 12)) / Math.max((Math.floor(curr / 4)), 1), 255))
        }
    }

    const output = `export const FTable = ${JSON.stringify(FTable, null, 2)};`;
    fs.writeFile('FTable.ts', output, (err) => {
        if (err) throw err;
        console.log(`FTable.ts has been saved.`);
    });

}

genftable()