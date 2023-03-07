type StateProps = {
    key: string;
    value: any;
};
declare class VannilaState {
    state: Map<string, StateProps>;
    id: string | undefined;
    template: string | undefined;
    constructor(domId: string);
    useState<T>(id: string, value: T, onChange: (v: T) => void): {
        get: () => any;
        set: (v: T) => void;
    };
    render(): void;
}
declare function dont_call_me_from_outside_vannila_get_state(s: StateProps): any;
