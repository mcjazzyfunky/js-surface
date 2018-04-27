type View = object | string | null;
type Validator = any;
type VirtualElement = any;
type Renderable = any;

type Methods = {
    [name: string]: Function
}

type ComponentFactory<Props, PublicMethods extends Methods = {}> =
    (props: Props, ...children: Renderable[]) => VirtualElement & PublicMethods; 

type PropertyConfig = Array<string> | {
    type?: Function,
    constraint?: Validator,
    nullable?: boolean,
    defaultValue?: any,
    inject?: boolean
}

type PropertiesConfig = {
    [name: string]: PropertyConfig
}

type FunctionalComponentConfig<Props extends Object> = {
    displayName: string,

    properties?: PropertiesConfig,

    render: (props: Props) => View
}

function defineFunctionalComponent<Props extends Object = {}>(
    config: FunctionalComponentConfig<Props>
    ): ComponentFactory<Props> {

    const ret: any = null;
    return ret as ComponentFactory<Props>;
}

type MyProps1 = {
    value: number
}

const MyComponent1 = defineFunctionalComponent<MyProps1>({
    displayName: 'Test',

    properties: {
        x: {
            type: Number,
            nullable: true,
            constraint: () => { },
            defaultValue: 3
        }
    },

    render(props: MyProps1): View {
        return null;
    }
});

//------------------------------------------------------------



type InitResult<Props extends Object, PublicMethods extends Methods> = {
    consumeProps: (props: Props) => void,
    forceUpdate: () => void
} & PublicMethods;

type StandardComponentConfig<Props extends Object = {}, State = {}, PublicMethods extends Methods = {}> = {
    displayName: string,

    properties?: PropertiesConfig,

    publicMethods?: string[],

    childInjections?: string[],

    init(updateView: (view: View) => void, updateState: (state: State) => void): InitResult<Props, PublicMethods>
}

function defineStandardComponent<Props extends Object = {}, State = {}, PublicMethods extends Methods = {}>(
    config: StandardComponentConfig<Props>
    ): ComponentFactory<Props, PublicMethods> {

    return (null as any) as ComponentFactory<Props> & PublicMethods;
}

type MyProps2 = {
    text: string
};

type MyState2 = {
    counter: number
};

type MyPublicMethods2 = {
    reset: () => void
}

const MyComponent2 = defineStandardComponent<MyProps2, MyState2, MyPublicMethods2>({
    displayName: 'MyComponent2',

    init(updateView: (view: View) => void, updateState: (state: MyState2) => void): InitResult<MyProps2, MyPublicMethods2> {
        return (null as any) as InitResult<MyProps2, MyPublicMethods2>;
    }
});

//------------------------------------------------------------

interface T {
    doit: Function
}


interface Listable {
    toArray: () => Array<any> | null
}

const l: Object | Listable = {
    toArray() {
        return null;
    },

    x: 44
}



interface BaseClassComponentConfig<Props extends Object, State, PublicMethods extends Methods> extends Object  {
    displayName: string,
    properties?: PropertiesConfig,
    publicMethods?: string[],
    childInjections?: string[],
    construct?: (props: Props) => void,
    render: () => View
   // [name: string]: any
}


const cfg: BaseClassComponentConfig<{}, {}, {}> = {
    displayName: 'xxx',

    
    render() {
        this.z2();
        return null
    }
}


function defineClassComponent<Props, State, PublicMethods extends Methods, T extends BaseClassComponentConfig<Props, State, PublicMethods>>
    (config: T): ComponentFactory<Props, PublicMethods> {

    return (null as any) as ComponentFactory<Props, PublicMethods>
}


type MyProps3 = {
    text: string
};

type MyState3 = {
    value: number
};

type MyPublicMethods3 = {
    reset: () => void
};

const MyComponent3 = defineClassComponent({
    displayName: 'MyComponent3',

    reset() {

    },

    reset3() {
        this.reset33();
    },

    render(): View {
        return null;
    }
});




type Cfg = {
    displayName: string,
    f: () => void
   // [name: string]: any
};

function f(cfg: Cfg) {};

f({
    displayName: 'xxx',

    f() {
        this.f2();
    }
});
