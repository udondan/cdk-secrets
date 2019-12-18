import lambda = require('@aws-cdk/aws-lambda');

export interface Tag {
    readonly key: string;
    readonly value: string,
}

export type Tags = [Tag];

export interface CommonProps {
    /**
     * The lambda function providing the functionality
     * @attribute
     */
    readonly provider?: lambda.IFunction;

    /**
    * Opaque string to force update
     * @attribute
    */
    readonly version?: string;
}

export function makeProperties(o: any) {
    var properties: any = {};

    for (let key in o) {
        if (key == 'provider') {
            continue;
        }

        let value = o[key];
        const t = typeof value;
        if (t != 'string' && t != 'number' && t != 'boolean') {
            value = JSON.stringify(value);
        }
        properties[cap(key)] = value; // TODO: we probably do not need the cap
    }

    // WORKS but complains with jsii!
    //for (let [key, value] of Object.entries(o)) {
    //    if (key == 'provider') {
    //        continue;
    //    }
    //    const t = typeof value
    //    if (t != 'string' && t != 'number' && t != 'boolean') {
    //        value = JSON.stringify(value)
    //    }
    //    properties[cap(key)] = value;
    //}
    return properties;
}

function cap(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
