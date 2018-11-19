
export type TsParam = {
    name: string
    type: string[]
}

const PARAM_REG = /%(?:([1-9]\d*)\$|\(([^\)]+)\))?(?:\+)?(?:0|'[^$])?(?:-)?(?:\d+)?(?:\.(?:\d+))?([bcdieufgostTvxXj])/g;

export function parseParams(format: string): TsParam[] {

    const formatParams = getFormatParams(format);
    if (!formatParams.length) {
        return [];
    }

    const params = formatParamsToTsParams(formatParams);

    return params;
}


function formatParamsToTsParams(formatParams: FormatParam[]) {
    const list: TsParam[] = [];
    const formatParamsWithNames: FormatParam[] = []

    let countParamsWithOrder = 0;

    formatParams.forEach((param, i) => {
        if (param.name) {
            formatParamsWithNames.push(param);
            return;
        }

        let index = i - countParamsWithOrder - formatParamsWithNames.length;
        if (param.order) {
            countParamsWithOrder++;
            index = param.order - 1;
        }
        if (list[index]) {
            return;
        }

        const type = getParamTypes(param.type);
        const name = 'p' + (index + 1);
        list[index] = { name, type };
    })

    if (formatParamsWithNames.length) {
        const type = [formatDataParamType(formatParamsWithNames)];
        const name = 'p' + (list.length + 1);
        list.push({ name, type });
    }

    return list;
}

function formatDataParamType(formatParams: FormatParam[]) {
    const data: { [index: string]: string[] } = {}

    formatParams.forEach((param) => {
        const name = param.name || '';
        if (!data[name]) {
            data[name] = getParamTypes(param.type);
        }
    })

    return '{ ' + Object.keys(data).map(item => item + ': ' + data[item].join(' | ')).join('; ') + ' }';
}


type FormatParam = {
    order?: number
    name?: string
    type: string
}

function getFormatParams(format: string) {
    const list: FormatParam[] = [];

    let result;
    while ((result = PARAM_REG.exec(format)) !== null) {
        if (result.length === 4) {
            list.push({
                order: parseInt(result[1]),
                name: result[2],
                type: result[3],
            })
        }
        else if (result.length === 3) {
            if (/^\d+$/.test(result[1])) {
                list.push({
                    order: parseInt(result[1]),
                    type: result[2],
                })
            } else {
                list.push({
                    name: result[1],
                    type: result[2],
                })
            }
        } else {
            list.push({
                type: result[1],
            })
        }
    }

    return list;
}

function getParamTypes(formatType: string) {
    switch (formatType) {
        // yields an integer as a binary number
        case 'b':
        // yields an integer as the character with that ASCII value
        case 'c':
        // yields an integer as a signed decimal number
        case 'd':
        case 'i':
        // yields a float using scientific notation
        case 'e':
        // yields an integer as an unsigned decimal number
        case 'u':
        // yields a float as is; see notes on precision above
        case 'f':
        // yields a float as is; see notes on precision above
        case 'g':
        // yields an integer as an octal number
        case 'o':
        // yields an integer as a hexadecimal number (lower-case)
        case 'x':
        // yields an integer as a hexadecimal number (upper-case)
        case 'X':
            return ['number'];
        // yields a string as is
        case 's':
            return ['string'];
        // yields true or false
        case 't':
            return ['boolean'];
        // yields the type of the argument
        case 'T':
        // yields the primitive value of the specified argument
        case 'v':
            return ['any'];
        // yields a JavaScript object or array as a JSON encoded string
        case 'j':
            return ['object', 'any[]'];
    }

    throw new Error(`Invalid format type ${formatType}`);
}
