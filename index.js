const glob = require('glob')
const fs = require('fs')
const tmpFile = 'tmp.txt'
const ResultFile = 'lucky-visitor.txt'

function remove_File(path) {
    if (fs.existsSync(path)) {
        fs.unlink(path, err => { if (err) throw err })
    }
}

async function filter(file) {
    let ary = fs.readFileSync(file, 'utf-8', { flag: 'r' }).toString().split('\r\n')
    let filtered = Array.from(new Set(ary));
    return filtered;
}

async function main() {
    try {
        // make base file.
        let basefile = fs.readFileSync('./src/ublockorigin.md', 'utf-8')

        // get current time.
        const date = new Date()
        let dateISO = date.toISOString()
        basefile = basefile.replace('{UPDATE}', dateISO)
        fs.appendFileSync(ResultFile, basefile, { flag: 'w' }, function (err) {
            if (err) throw err
        })

        // get ioc.txt paths.
        const paths = glob.sync('**/ioc.txt')

        // create temporary file.
        for (const path of paths) {
            let list = fs.readFileSync(path, 'utf-8', { flag: 'r' })
            fs.appendFileSync(tmpFile, list, { flag: 'a+' }, function (err) {
                if (err) throw err
            })
        }

        // async
        let lists = await filter(tmpFile);

        fs.appendFileSync(ResultFile, lists.join('\n'), { flag: 'a+' }, err => {
            if (err) throw err
        })
    } catch (err) {
        console.error(err.message)
    } finally {
        remove_File(tmpFile)
        console.log('script completed.')
    }
}

main()
