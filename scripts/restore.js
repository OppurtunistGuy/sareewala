import {DatabaseSync} from 'node:sqlite';
import {readFileSync,copyFileSync,existsSync,renameSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname,resolve} from 'node:path';
const source=process.argv[2];if(!source||!process.argv.includes('--server-stopped'))throw Error('Usage: node scripts/restore.js backup.sqlite --server-stopped. Stop the server first.');
const expected=readFileSync(source+'.sha256','utf8').trim();const actual=createHash('sha256').update(readFileSync(source)).digest('hex');if(actual!==expected)throw Error('Backup checksum does not match.');
const check=new DatabaseSync(source,{readOnly:true});if(check.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('Backup integrity check failed.');check.close();
const target=process.env.DB_PATH||resolve('data/store.sqlite');mkdirSync(dirname(target),{recursive:true});const suffix='.pre-restore-'+Date.now();for(const ext of ['','-wal','-shm'])if(existsSync(target+ext))renameSync(target+ext,target+ext+suffix);copyFileSync(source,target);console.log('Database restored; previous database retained with',suffix);
