import { z } from "zod";

export type Primitive = string | number | boolean | null | undefined;

export type QueryParamValue =
  | Primitive
  | Record<string, Primitive>
  | Array<Primitive | Record<string, Primitive>>;

export type AllowedOperators =
  | ">"
  | "<"
  | ">="
  | "<="
  | "!="
  | "="
  | "like"
  | "not like"
  | "whereIn"
  | "whereNotIn"
  | "whereBetween"
  | "whereNotBetween";

type SortDirection = "asc" | "desc";
type SortableColumn<T> = keyof T & string;

type OrderByInput<T> =
  | `${SortableColumn<T>}:${SortDirection}` // Template literal for "column:asc"
  | SortableColumn<T> // Single column "column"
  | [SortableColumn<T>, SortDirection]; // Tuple ["column", "asc"]

// Update the select type to be more flexible
type SelectColumns<T> = keyof ExtractRelations<T> | string[] | keyof T | string;

// Modify the RelationQueryModifier type
type RelationQueryModifier<T> = {
  where?: Array<[keyof ExtractRelations<T>, AllowedOperators, any]>;
  orderBy?: OrderByInput<T> | OrderByInput<T>[];
  limit?: number;
  select?: SelectColumns<T>;
};

/**
 * Extracts relation keys from an interface, identifying object and object array properties.
 * @template T The interface type to extract relations from
 */
export type ExtractRelations<T> = {
  [K in keyof T]: T[K] extends object
    ? K
    : T[K] extends Array<infer U>
    ? U extends object
      ? K
      : never
    : T[K] extends object | undefined
    ? K
    : never;
}[keyof T];

// type QueryMethodName = "where" | "orderBy" | "limit" | "offset" | "select";

export type QueryBuilderOptions = {
  /**
   * Transform function to modify the final query parameters
   * Useful for adding custom logic or transformations
   */
  transformer?: (params: Record<string, any>) => Record<string, any>;

  /**
   * Provide a base url to be used for all queries
   */
  baseUrl?: string;

  /**
   * Validation schema for query parameters
   */
  validation?: z.ZodSchema;
};

class QueryBuilder<T extends Record<string, any>> {
  private basePath: string;
  private pathParams: Record<string, string | number> = {};
  private queryParams: Record<string, any> = {};
  private options: QueryBuilderOptions;

  constructor(basePath: string, options: QueryBuilderOptions = {}) {
    this.basePath = basePath;
    this.options = {
      transformer: (params) => params,
      validation: z.any(),
      ...options,
    };
  }

  /** Adds relations to be included in the query */
  with(relations: ExtractRelations<T> | ExtractRelations<T>[]): this {
    const relationString = Array.isArray(relations)
      ? relations.join(",")
      : String(relations);
    this.queryParams.with = relationString;
    return this;
  }

  /** Flexible where clause supporting multiple formats */
  where(
    conditions:
      | { [K in keyof T]?: T[K] }
      | Array<[keyof T, AllowedOperators, any]>
  ): this {
    // If conditions are an object, handle simple key-value pairs
    if (typeof conditions === "object" && !Array.isArray(conditions)) {
      Object.entries(conditions).forEach(([key, value]) => {
        this.queryParams[`where[${key}]`] = value;
      });
    }
    // If conditions are an array, handle more complex where clauses
    if (Array.isArray(conditions)) {
      conditions.forEach((condition) => {
        // @ts-expect-error FIXME: to be fixed
        if (condition.length === 2) {
          // Simple key-value pair

          // @ts-expect-error FIXME: to be fixed
          this.queryParams[`where[${condition[0]}]`] = condition[1];
        } else if (condition.length === 3) {
          const isArray = Array.isArray(condition[2]);

          if (isArray) {
            // Handle array conditions
            // @ts-expect-error FIXME: to be fixed
            const key = `where[${condition[0]}][${condition[1]}]`;

            // Directly assign the entire array instead of individual iterations
            this.queryParams[key] = (condition[2] as []).join(",");
          } else {
            // Handle non-array single value conditions
            // @ts-expect-error FIXME: to be fixed
            const key = `where[${condition[0]}][${condition[1]}]`;
            this.queryParams[key] = condition[2];
          }
        }
      });
    }
    return this;
  }

  orderBy(
    column:
      | OrderByInput<T>
      | Partial<Record<SortableColumn<T>, SortDirection>>
      | OrderByInput<T>[],
    value?: SortDirection
  ): this {
    if (typeof column === "string" && value) {
      this.queryParams[`orderBy[${column}]`] = value;
      return this;
    } else if (typeof column === "string") {
      const [columnName, direction = "asc"] = column.split(":");
      this.queryParams[`orderBy[${columnName}]`] = direction;
    }
    return this;
  }

  /** Adds limit to the query */
  limit(value: number): this {
    this.queryParams.limit = value;
    return this;
  }

  /** Adds a path parameter to the URL */
  path(key: string, value: string | number): this {
    this.pathParams[key] = value;
    return this;
  }

  /**
   * Apply query modifiers to a specific relation
   * @param relation The name of the relation to modify
   * @param modifiers The query modifiers to apply
   */
  queryRelation<R extends ExtractRelations<T>>(
    relation: R,
    modifiers: RelationQueryModifier<T>
  ): this {
    // Handle where clause
    if (modifiers.where) {
      const whereKey = `query_${String(relation)}[where]`;

      if (Array.isArray(modifiers.where)) {
        modifiers.where.forEach((condition) => {
          // @ts-expect-error FIXME: to be fixed
          if (condition.length === 2) {
            // @ts-expect-error FIXME: to be fixed
            this.queryParams[`${whereKey}[${condition[0]}]`] = condition[1];
          } else if (condition.length === 3) {
            // @ts-expect-error FIXME: to be fixed
            const operatorKey = `${whereKey}[${condition[0]}][${condition[1]}]`;
            this.queryParams[operatorKey] = condition[2];
          }
        });
      } else {
        Object.entries(modifiers.where).forEach(([key, value]) => {
          this.queryParams[`${whereKey}[${key}]`] = value;
        });
      }
    }

    // Handle orderBy
    if (modifiers.orderBy) {
      const orderByKey = `query_${String(relation)}[orderBy]`;

      if (Array.isArray(modifiers.orderBy)) {
        modifiers.orderBy.forEach((order, index) => {
          if (typeof order === "string") {
            const [column, direction = "asc"] = order.split(":");
            this.queryParams[`${orderByKey}[${index}][column]`] = column;
            this.queryParams[`${orderByKey}[${index}][direction]`] = direction;
          } else if (Array.isArray(order)) {
            this.queryParams[`${orderByKey}[${index}][column]`] = order[0];
            this.queryParams[`${orderByKey}[${index}][direction]`] =
              order[1] || "asc";
          }
        });
      } else if (typeof modifiers.orderBy === "string") {
        const [column, direction = "asc"] = modifiers.orderBy.split(":");
        this.queryParams[`${orderByKey}`] = `${column},${direction}`;
      }
    }

    // Handle limit
    if (modifiers.limit !== undefined) {
      this.queryParams[`query_${String(relation)}[limit]`] = modifiers.limit;
    }

    // Handle select
    if (modifiers.select) {
      const selectColumns = Array.isArray(modifiers.select)
        ? modifiers.select.join(",")
        : String(modifiers.select);
      this.queryParams[`query_${String(relation)}[select]`] = selectColumns;
    }

    return this;
  }

  /** Select specific columns */
  select(columns: (keyof T)[] | keyof T): this {
    const selectColumns = Array.isArray(columns)
      ? columns.join(",")
      : String(columns);
    this.queryParams.select = selectColumns;
    return this;
  }

  /** Pagination support */
  /**
   * @param perPage The number of items per page
   * @param page The page number you want to get
   */
  paginate(perPage: number, page?: number): this {
    this.queryParams.paginate = perPage;
    if (page) {
      this.queryParams.page = page;
    }
    return this;
  }

  /**
   * @param page The page number you want to receive
   */
  page(page: number): this {
    if (!this.queryParams.page) {
      this.queryParams.page = page;
    }

    return this;
  }

  first(): string {
    this.queryParams.getter = "first";

    return this.build();
  }

  get(): string {
    this.queryParams.getter = "get";

    return this.build();
  }

  /** Builds the final URL with all path and query parameters */
  build(): string {
    const url = this.options.baseUrl?.replace(/\/+$/, "") ?? "";
    let path = this.basePath;

    // Replace path parameters first
    for (const [key, value] of Object.entries(this.pathParams)) {
      path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
    }

    path = path.replace(/^\/+|\/+$/g, "");

    // If no base URL is provided, use the path as-is
    const fullUrl = url ? `${url}/${path}` : path;

    // Apply any parameter transformations
    const transformedParams = this.options.transformer
      ? this.options.transformer(this.queryParams)
      : this.queryParams;

    // Optional validation if a schema is provided
    if (this.options.validation) {
      try {
        this.options.validation.parse(transformedParams);
      } catch (error) {
        console.error("Query parameter validation failed", error);
        throw error;
      }
    }

    // Build query string
    const params = new URLSearchParams();
    Object.entries(transformedParams).forEach(([key, value]) => {
      // Handle array and object values
      if (
        Array.isArray(value) ||
        (typeof value === "object" && value !== null)
      ) {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, String(value));
      }
    });

    return params.toString() ? `${fullUrl}?${params.toString()}` : fullUrl;
  }
}

/**
 * Factory function for creating type-safe QueryBuilder instances
 * @template T The interface type describing the resource being queried
 */
function createQuery<T extends Record<string, any>>(
  basePath: string,
  options?: QueryBuilderOptions
): QueryBuilder<T> {
  return new QueryBuilder<T>(basePath, options);
}

export { createQuery, QueryBuilder };
