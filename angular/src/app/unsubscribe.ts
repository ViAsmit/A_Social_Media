export function AutoUnsubscribe(constructor) {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy =  function() {
        for(let prop in this){
            if(prop == "subscription"){
                for(let sub in this[prop]){
                    if(sub && (typeof this[prop][sub].unsubscribe === "function")){
                        this[prop][sub].unsubscribe();
                    }
                }
                break;
            }
        }
        original && typeof original === "function" && original.apply(this, arguments);
    };
}
