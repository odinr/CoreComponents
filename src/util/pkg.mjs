import { dirname } from "path"; 
import chalk from "chalk";
import Table from "cli-table";
import findPkg from "read-pkg-up";

export const config = findPkg.sync();
if(config.path !== undefined){
    config.dirname = dirname(config.path);
}
config.toString = attr => {
    const table = basicTable();
    attr = attr || ['version','name', 'description'];
    attr.map(a => table.push({[a]: config.pkg[a]}));
    table.push({src: config.path});
    return table.toString();
}

const basicTable = () => new Table({
    chars: { top: '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
           , bottom: '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
           , left: '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
           , right: '' , 'right-mid': '' , 'middle': ' ' },
    style: { head: ['yellow'] }
  });

  export default config;