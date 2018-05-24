import Table from "cli-table";
export function basicTable(){
    return new Table({
        chars: { top: '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
                , bottom: '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
                , left: '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
                , right: '' , 'right-mid': '' , 'middle': ' ' },
        style: { head: ['yellow'] }
    });
} 

export default {basicTable};