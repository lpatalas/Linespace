export class NumberDictionary {

    private items: { [id: number]: any } = {};
    private _keys: number[] = [];

    add(id: number, value: any) {
        this.items[id] = value;
    }

    remove(id: number) {
        delete this.items[id];
        this._keys.push(id);
    }

    clear() {
        this.items = {}; // TODO it is correct to override this by new object not removing existing one ?
        this._keys.splice(0, this._keys.length);
    }

    get(id: number) {
        return this.items[id];
    }

    get keys(): number[] {
        return this._keys;
    }

    count(){
        return this._keys.length;
    }

}

export class StringDictionary {

    private items: { [id: string]: any } = {};
    private _keys: string[] = [];

    add(id: string, value: any) {
        this.items[id] = value;
        this._keys.push(id);
    }

    remove(id: string) {
        delete this.items[id];
        this._keys.splice(this._keys.indexOf(id), 1);
    }

    clear() {
        this.items = {}; // TODO it is correct to override this by new object not removing existing one ?
        this._keys.splice(0, this._keys.length);
    }

    get(id: string) {
        return this.items[id];
    }

    get keys(): string[] {
        return this._keys;
    }

    count(){
        return this._keys.length;
    }

}