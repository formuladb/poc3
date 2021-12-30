import { spawn } from 'child_process';

export function runCmd(cmd: string, ...args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        var prc = spawn(cmd, args);

        //noinspection JSUnresolvedFunction
        prc.stdout.setEncoding('utf8');
        prc.stdout.on('data', function (data) {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            console.log(lines.join(""));
        });
        prc.stderr.on('data', function (data) {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            console.error(lines.join(""));
        });

        prc.on('close', function (code) {
            if (code) {
                const err = 'process exit code ' + code;
                console.error(err);
                reject(err);
            } else resolve();
        });
    });
}
