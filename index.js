const glob = require('glob')
const fs = require('fs')
const ResultFile = 'lucky-visitor.txt'

function remove_File(path) {
    if (fs.existsSync(path)) {
        fs.unlink(path, err => { if (err) throw err })
    }
}

async function main() {
    try {
        // init file.
        remove_File(ResultFile);
        let basefile = fs.readFileSync('./src/ublockorigin.md', 'utf-8')

        // get time.
        const date = new Date()
        let dateISO = date.toISOString()
        basefile = basefile.replace('{UPDATE}', dateISO)
        fs.appendFileSync(ResultFile, basefile, { flag: 'w' }, function (err) {
            if (err) throw err
        })

        // get ioc.txt paths.
        const paths = glob.sync('**/ioc.txt')

        // read files and set array.
        let list = []
        for (const path of paths) {
            let array = fs.readFileSync(path, 'utf-8', { flag: 'r' }).toString().split('\n')
            array = array.filter(Boolean)
            list.push.apply(list, array);
        }
        // remove duplicate urls.
        list = new Set(list);

        // create list.
        for (const line of list) {
            fs.appendFileSync(ResultFile, line + '\n', { flag: 'a' }, err => {
                if (err) throw err
            })
        }
    } catch (err) {
        console.error(err.message)
    } finally {
        console.log('script completed.')
    }
}

main()
