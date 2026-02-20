export interface IObserver<T> {
  update(event: T): Promise<void> | void;
}

export interface ISubject<T> {
  subscribe(obs: IObserver<T>): void;
  unsubscribe(obs: IObserver<T>): void;
  notify(event: T): Promise<void>;
}
