/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Based on https://github.com/dobesv/PlanOut.js/blob/types/types/index.d.ts
declare module 'planout' {
  export interface Inputs {
    [key: string]: string;
  }

  export type ParamValue = string | number | boolean | null | undefined;

  export type Params = {
    [key: string]: ParamValue;
  };

  export interface PlanoutEvent {
    event: string;
    name: string;
    salt: string;
    inputs: Inputs;
    params: Params;
  }

  export interface PlanoutNamespaceConfig {
    name: string;
    num_segments: number;
    primary_unit: string;
    compiled: PlanoutCode;
  }

  export interface PlanoutExperimentConfig {
    name: string;
    namespace_name: string;
    num_segments: number;
    compiled: PlanoutCode;
  }

  export interface PlanoutNamespaceOp {
    op: 'add' | 'remove';
    experiment: PlanoutExperimentConfig;
  }

  export interface PlanoutConfig {
    namespaces: PlanoutNamespaceConfig[],
    experiments: PlanoutNamespaceOp[],
  }

  export class Assignment<ParamsType> {
    constructor(experimentSalt: string, overrides?: Partial<ParamsType>);

    evaluate(value: unknown): unknown;

    getOverrides(): Partial<ParamsType>;

    /**
     * Set a value as an "override" - this value will not be replaced by calls
     * to `set`.
     */
    addOverride<K extends keyof ParamsType>(key: K, value: ParamsType[K]): void;

    /**
     * Set all the overrides (fixed values) at once
     */
    setOverrides(overrides: Partial<ParamsType>): void;

    /**
     * Set a value
     *
     * If a literal value is provided, it is used as is.
     *
     * If a PlanOutOpRandom instance is passed, this calls `execute(this)` on
     * it to calculate the value to store.
     *
     * If the value was previously set as an override, this will not replace
     * the existing value.
     *
     * @param key Name of the parameter
     * @param value Value or calculation
     */
    set<K extends keyof ParamsType>(
      key: K,
      value: ParamsType[K] | Ops.Base.PlanOutOp<any, ParamsType[K]>,
    ): void;

    /**
     * Get a parameter value.  If the value would have been null or undefined,
     * `def` is returned.
     */
    get<K extends keyof ParamsType>(name: K, def?: ParamsType[K]): ParamsType[K];

    /**
     * Get all the parameter values set so far
     */
    getParams(): Partial<ParamsType>;

    /**
     * Remove a parameter value
     */
    del(name: string): void;

    /**
     * Number of params set so far
     */
    length(): number;
  }

  export class BaseExperiment<InputsType, ParamsType> {
    constructor(inputs: InputsType);
  }

  export class Experiment<InputsType, ParamsType> extends BaseExperiment<InputsType, ParamsType> {
    protected _exposureLogged: boolean;
    protected _inExperiment: boolean;
    protected inputs?: InputsType;
    public _assigned: boolean;
    public _assignment: Assignment<Partial<ParamsType>>;

    /**
     * Subclasses can use this implementation of getParamNames to calculate
     * the parameter names by examining the source code of `assign` at runtime.
     */
    getDefaultParamNames(): string[];

    requireAssignment(): void;
    requireExposureLogging(): void;

    /**
     * Called by the constructor to do any additional setup the subclass
     * wants to do.
     *
     * This should at a minimum call `this.setName('<experiment name>')`.
     *
     * Experiment names should be chosen to be unique - there should not be
     * two experiments with the same name running at similar times, as this
     * will confuse this library and also make it harder to distinguish the
     * results of different experiments.
     *
     * @abstract
     */
    setup(): void;

    /**
     * True if this experiment is active
     */
    inExperiment(): boolean;

    /**
     * Override a parameter, preventing it from being randomly selected
     */
    addOverride(key: string, value: string): void;

    /**
     * Replace all overrides
     */
    setOverrides(obj: Partial<InputsType> & Partial<ParamsType>): void;

    getSalt(): string;
    setSalt(value: string): void;

    getName(): string;

    /**
     * This is where you define the calculation of the parameters of the
     * experiment.  You call params.set(<name>, <value or op>)
     *
     * @abstract
     * @param params Object to receive parameter definitions
     * @param args Constructor argument
     */
    assign(params: Assignment<ParamsType>, args: InputsType): boolean | void;

    /**
     * Get the parameter names for this experiment.  This is a list of names
     * that are calculated / defined by the experiment, which you can fetch
     * using "get".
     *
     * @abstract
     */
    getParamNames(): string[];

    shouldFetchExperimentParameter(name: string): boolean;

    /**
     * Call this in your setup implementation to set the experiment name
     */
    setName(name: string): void;

    setAutoExposureLogging(b: boolean): void;

    getParams(): ParamsType;

    get<K extends keyof ParamsType, DT>(
      name: K,
      def: ParamsType[K],
    ): ParamsType[K];

    toString(): string;

    logExposure(extras: { [k: string]: any }): void;

    shouldLogExposure(paramName: string): boolean;

    logEvent(eventType: string, extras: { [k: string]: any }): void;

    /**
     * Called to configure logging when an experiment starts up.
     *
     * @abstract
     */
    configureLogger(): void;

    /**
     * Log a message to the analytics system
     *
     * @abstract
     * @param data
     */
    log(data: {
      event?: string;
      name?: string;
      time?: number;
      salt?: string;
      inputs?: InputsType;
      params?: ParamsType;
      extra_data?: { [k: string]: any };
    }): void;

    /**
     * Return whether exposure to this experiment was already logged
     *
     * Suggested implementation is to return this._exposureLogged in client
     * side code, but you might also want to cache this information in
     * localStorage or somesuch to avoid repeated logging of the exposure.
     *
     * @abstract
     */
    previouslyLogged(): boolean;
  }

  export namespace ExperimentSetup {
    const registerExperimentInput: (
      key: string,
      value: string | number | boolean | null | undefined,
      experimentName?: string | null,
    ) => void;

    const getExperimentInputs: (experimentName: string) => any;
  }

  export interface PlanoutCodeLiteralOp {
    op: 'literal';
    value: any;
  }
  export interface PlanoutCodeGetOp {
    op: 'get';
    var: string;
  }
  export interface PlanoutCodeSetOp {
    op: 'set';
    var: string;
    value: PlanoutCode;
  }
  export interface PlanoutCodeSeqOp {
    op: 'seq';
    seq: PlanoutCode[];
  }
  export interface PlanoutCodeCondOp {
    op: 'cond';
    cond: Array<{ if: PlanoutCode; then: PlanoutCode }>;
  }
  export interface PlanoutCodeBinaryOp {
    op: 'equals' | 'and' | 'or' | '>' | '<' | '>=' | '<=' | '%' | '/';
    left: PlanoutCode;
  }
  export interface PlanoutCodeUnaryOp {
    op: 'return' | 'not' | 'round' | '-' | 'length';
    value: PlanoutCode;
  }
  export interface PlanoutCodeCommutativeOp {
    op: 'min' | 'max' | 'product' | 'sum';
    values: PlanoutCode[];
  }
  export type PlanoutCodeValue = string | number | boolean | null;

  export interface PlanoutCodeRandomRangeOp {
    op: 'randomFloat' | 'randomInteger';
    min: PlanoutCode;
    max: PlanoutCode;
  }
  export interface PlanoutCodeRandomTrialOp {
    op: 'bernoulliTrial';
    p: PlanoutCode;
  }
  export interface PlanoutCodeRandomFilterOp {
    op: 'bernoulliFilter';
    p: PlanoutCode;
    choices: PlanoutCode[];
  }
  export interface PlanoutCodeUniformChoiceOp {
    op: 'uniformChoice';
    choices: PlanoutCode[];
  }
  export interface PlanoutCodeWeightedChoiceOp {
    op: 'weightedChoice';
    choices: PlanoutCode[];
  }
  export interface PlanoutCodeSampleOp {
    op: 'sample';
    choices: PlanoutCode[];
    draws: PlanoutCode;
  }
  export type PlanoutCodeRandomOp = { unit: PlanoutCode } & (
    | PlanoutCodeRandomRangeOp
    | PlanoutCodeRandomTrialOp
    | PlanoutCodeRandomFilterOp
    | PlanoutCodeUniformChoiceOp
    | PlanoutCodeWeightedChoiceOp
    | PlanoutCodeSampleOp
    );
  export type PlanoutCodeCoreOp =
    | PlanoutCodeGetOp
    | PlanoutCodeSetOp
    | PlanoutCodeSeqOp
    | PlanoutCodeCondOp
    | PlanoutCodeLiteralOp
    | PlanoutCodeBinaryOp
    | PlanoutCodeUnaryOp
    | PlanoutCodeCommutativeOp;

  type PlanoutCodeUnit =
    | PlanoutCodeValue
    | PlanoutCodeCoreOp
    | PlanoutCodeRandomOp;

  export type PlanoutCode = PlanoutCodeUnit | PlanoutCodeUnit[];

  /**
   * Execute some PlanoutCode AST
   *
   * Values that are set in the code are stored in the "env" inside the
   * interpreter, and can be fetched using "get".  "get" also returns
   * values from the input.
   */
  export class Interpreter<InputsType, ParamsType> extends Object {
    name: string;

    _inExperiment?: boolean;

    /**
     * Run some planout code
     *
     * @param serialization Code to execute to update the environment
     * @param experimentSalt Salt to use for "random" values
     * @param inputs Values to provide initially as variables in the script
     * @param environment Environment to use; if not provided, one will be created
     */
    constructor(
      serialization: PlanoutCode,
      experimentSalt?: string,
      inputs?: InputsType,
      environment?: Assignment<ParamsType>,
    );

    inExperiment(): boolean;

    setEnv(newEnv: Assignment<ParamsType>): Interpreter<InputsType, ParamsType>;

    has(name: string): boolean;

    get<K extends keyof ParamsType>(name: K, def: ParamsType[K]): ParamsType[K];

    getParams(): ParamsType;

    set<K extends keyof ParamsType>(
      key: K,
      value: ParamsType[K] | Ops.Base.PlanOutOp<any, ParamsType[K]>,
    ): Interpreter<InputsType, ParamsType>;

    getSaltSeparator(): string;

    setOverrides(overrides: Partial<ParamsType>): void;

    getOverrides(): Partial<ParamsType>;

    hasOverride(name: string): boolean;

    registerCustomOperators(operators: unknown): void;

    evaluate(code: PlanoutCode): any;
  }

  export namespace Namespace {
    class Namespace<ParamsType> {
      public numSegments: number;

      // Add an experiment; returns false if the experiment could not be added
      addExperiment<T extends ParamsType>(
        name: string,
        obj: BaseExperiment<unknown, T>,
        segments: number,
      ): boolean;

      removeExperiment(name: string): void;

      setAutoExposureLogging(value: boolean): void;

      inExperiment(): boolean;

      get<K extends keyof ParamsType>(name: string, def: ParamsType[K]): ParamsType[K];

      logExposure(extras: object): void;

      logEvent(eventType: string, extras: object): void;

      requireExperiment(): void;

      requireDefaultExperiment(): void;
    }

    class SimpleNamespace<InputsType, ParamsType> extends Namespace<ParamsType> {
      constructor(args: InputsType);

      inputs: InputsType;

      _experiment?: Experiment<InputsType, ParamsType>;

      _defaultExperiment?: Experiment<InputsType, ParamsType>;

      _assignExperiment(): void;

      _assignExperimentObject(name: string): void;

      currentExperiments: { [key: string]: BaseExperiment<InputsType, ParamsType> };

      setupDefaults(): void;

      setup(): void;

      setupExperiments(): void;

      getPrimaryUnit(): string;

      allowedOverride(): boolean;

      getOverrides(): Partial<ParamsType>;

      setPrimaryUnit(value: string): void;

      getSegment(): number;

      defaultGet<K extends keyof ParamsType>(
        name: K,
        def: ParamsType[K],
      ): ParamsType[K];

      getName(): string;

      setName(name: string): void;

      previouslyLogged(): boolean;

      inExperiment(): boolean;

      setGlobalOverride(name: string): void;

      setLocalOverride(name: string): void;

      getParams(experimentName: string): ParamsType | null;

      getOriginalExperimentName(): string | null;
    }
  }

  type PlanOutOpMapper<T> = Assignment<T> | Interpreter<any, T>;

  interface PlanOutOp<T> {
    execute(assignment: PlanOutOp<unknown>): T;
  }

  export namespace Ops {
    namespace Core {
      class Literal<T> extends Ops.Base.PlanOutOp<{ value: T }, T> {}

      class Get extends Ops.Base.PlanOutOp<{ var: string }, string> {}

      class Seq<T> extends Ops.Base.PlanOutOp<{ seq: T[] }, T[]> {}

      class Set<
        T extends string | number | Ops.Base.PlanOutOp<any, any>
        > extends Ops.Base.PlanOutOp<{ var: string; value: T }, void> {}

      class Arr<T> extends Ops.Base.PlanOutOp<{ values: T[] }, T[]> {}

      class Map<ArgsT> extends Ops.Base.PlanOutOp<ArgsT, ArgsT> {}

      class Coalesce<T> extends Ops.Base.PlanOutOp<{ values: T[] }, T> {}

      class Index<T> extends Ops.Base.PlanOutOp<
        { base: T; index: keyof T },
        T
        > {}

      class Cond<T> extends Ops.Base.PlanOutOp<
        { cond: Array<{ if: any; then: T }> },
        T
        > {}

      class And<T> extends Ops.Base.PlanOutOp<{ values: T[] }, boolean> {}

      class Or<T> extends Ops.Base.PlanOutOp<{ values: T[] }, boolean> {}

      class Product extends Ops.Base.PlanOutOpCommutative<number> {}

      class Sum extends Ops.Base.PlanOutOpCommutative<number> {}

      class Equals<T> extends Ops.Base.PlanOutOpBinary<T, boolean> {}

      class GreaterThan extends Ops.Base.PlanOutOpBinary<number, boolean> {}

      class LessThan extends Ops.Base.PlanOutOpBinary<number, boolean> {}

      class LessThanOrEqualTo extends Ops.Base.PlanOutOpBinary<
        number,
        boolean
        > {}

      class GreaterThanOrEqualTo extends Ops.Base.PlanOutOpBinary<
        number,
        boolean
        > {}

      class Mod extends Ops.Base.PlanOutOpBinary<number, number> {}

      class Divide extends Ops.Base.PlanOutOpBinary<number, number> {}

      class Round extends Ops.Base.PlanOutOpUnary<number, number> {}

      class Not<T> extends Ops.Base.PlanOutOpUnary<T, boolean> {}

      class Negative extends Ops.Base.PlanOutOpUnary<number, number> {}

      class Min extends Ops.Base.PlanOutOpCommutative<number> {}

      class Max extends Ops.Base.PlanOutOpCommutative<number> {}

      class Length<T extends { length: any }> extends Ops.Base.PlanOutOpUnary<
        T,
        T['length']
        > {}

      class Return<T> extends Ops.Base.PlanOutOp<{ value: T }, never> {}
    }
    namespace Random {
      type UnitType = null | string | number | Array<string | number | null>;
      class PlanOutOpRandom<InputsType, ValueT> extends Ops.Base
        .PlanOutOpSimple<
        InputsType & {
        unit: UnitType;
      },
        ValueT
        > {}

      // Pick `draws` elements at random from `choices`
      class Sample<T> extends PlanOutOpRandom<
        { choices: T[]; draws: number },
        T[]
        > {}

      // Pick one element at random from `choices`; weights make the selection
      // uneven
      class WeightedChoice<T> extends PlanOutOpRandom<
        { choices: T[]; weights: number[] },
        T
        > {}

      // Pick one element at random from `choices`, all choices equally likely
      class UniformChoice<T> extends PlanOutOpRandom<{ choices: T[] }, T> {}

      class BernoulliFilter<T> extends PlanOutOpRandom<
        { p: number; choices: T[] },
        T[]
        > {}

      class BernoulliTrial extends PlanOutOpRandom<{ p: number }, 0 | 1> {}

      class RandomInteger extends PlanOutOpRandom<
        { min: number; max: number },
        number
        > {}

      class RandomFloat extends PlanOutOpRandom<
        { min: number; max: number },
        number
        > {}
    }
    namespace Base {
      class PlanOutOp<ArgsT, ValueT, OtherParamsT = unknown> {
        constructor(args: ArgsT);

        execute(mapper: PlanOutOpMapper<OtherParamsT>): ValueT;

        getArgMixed<K extends keyof ArgsT>(name: K): ArgsT[K];
        getArgNumber<K extends keyof Extract<ArgsT, number>>(name: K): number;
        getArgString<K extends keyof Extract<ArgsT, string>>(name: K): string;
        getArgList<K extends keyof Extract<ArgsT, any[]>>(name: K): any[];
        getArgObject<K extends keyof Extract<ArgsT, object>>(name: K): object;
        getArgIndexish<K extends keyof Extract<ArgsT, object | any[]>>(
          name: K,
        ): object | any[];
      }

      class PlanOutOpSimple<
        ArgsT,
        ValueT,
        OtherParamsT = unknown
        > extends PlanOutOp<ArgsT, ValueT, OtherParamsT> {
        simpleExecute(): unknown;
      }

      class PlanOutOpUnary<ArgT, ValueT> extends PlanOutOpSimple<
        { value: ArgT },
        ValueT
        > {}

      class PlanOutOpBinary<T, U> extends PlanOutOpSimple<
        { left: T; right: T },
        U
        > {}

      class PlanOutOpCommutative<T> extends PlanOutOpSimple<
        { left: T; right: T },
        T
        > {}
    }
  }
}
