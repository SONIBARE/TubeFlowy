import Events from "./Events";
type ModelEvents<T> = {
  [P in keyof T & string as `${P}Changed`]: T[P];
};

class Model<TState> extends Events<ModelEvents<TState>> {
  constructor(protected attributes: TState) {
    super();
  }

  public get<TKey extends keyof TState>(key: TKey): TState[TKey] {
    return this.attributes[key];
  }

  public set = <TKey extends keyof TState>(key: TKey, value: TState[TKey]) => {
    this.attributes[key] = value;
    //@ts-expect-error need to figure out how to type Changed events based on generic
    this.trigger(`${key}Changed`, value);
  };
}

export default Model;
