function extractDiff<T, R extends Record<any, any>>(target: T, to: R): Partial<T>{
    if(target === to) return {};
    if(target === undefined || target === null) return to;
    if(to === undefined || to === null) return target;

    const diff = <T>{};
    const keys = Object.keys(target);
    for(const key of keys){
        if(to[key as keyof T] === undefined) continue;
        if(typeof target[key as keyof T] === "object"){
            const data = extractDiff(target[key as keyof T], to[key as keyof T]);
            if(Object.keys(data).length>0) {
                diff[key as keyof T] = data as T[keyof T];
            }
            continue;
        }  
        if(to[key as keyof T] != target[key as keyof T]) diff[key as keyof T] = to[key as keyof T];    
    }
    return diff;
}

export default extractDiff;