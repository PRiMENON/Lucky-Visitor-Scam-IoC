const glob = require('glob')
const fs = require('fs')
const tmpFile = 'tmp.txt'
const ResultFile = 'lucky-visitor.txt'

function remove_File(path) {
    if (fs.existsSync(path)) {
        fs.unlink(path, err => { if (err) throw err })
    }
}

async function main() {
    try {
        // make base file.
        let basefile = await fs.readFileSync('./src/ublockorigin.md', 'utf-8')

        // get current time.
        const date = new Date()
        let dateISO = date.toISOString()
        basefile = basefile.replace('{UPDATE}', dateISO)
        await fs.appendFileSync(ResultFile, basefile, { flag: 'w' }, function (err) {
            if (err) throw err
        })

        // get ioc.txt paths.
        const paths = glob.sync('**/ioc.txt')

        // create temporary file.
        for (const path of paths) {
            let list = await fs.readFileSync(path, 'utf-8', { flag: 'r' })
            await fs.appendFileSync(tmpFile, list, { flag: 'a+' }, function (err) {
                if (err) throw err
            })
        }

        // read temporary file, make filter file.
        let lists = await fs.readFileSync(tmpFile, 'utf-8', { flag: 'r' }).toString().split('\r\n')
        lists = await Array.from(new Set(lists));
        await fs.appendFileSync(ResultFile, lists.join('\n'), { flag: 'a+' }, err => {
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
