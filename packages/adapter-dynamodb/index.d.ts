import type { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import type { Adapter } from "next-auth/adapters";
export interface DynamoDBAdapterOptions {
    tableName?: string;
    partitionKey?: string;
    sortKey?: string;
    indexName?: string;
    indexPartitionKey?: string;
    indexSortKey?: string;
}
export declare function DynamoDBAdapter(client: DynamoDBDocument, options?: DynamoDBAdapterOptions): Adapter;
declare const format: {
    /** Takes a plain old JavaScript object and turns it into a Dynamodb object */
    to(object: Record<string, any>): Record<string, unknown>;
    /** Takes a Dynamo object and returns a plain old JavaScript object */
    from<T = Record<string, unknown>>(object?: Record<string, any>): T | null;
};
declare function generateUpdateExpression(object: Record<string, any>): {
    UpdateExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ExpressionAttributeValues: Record<string, unknown>;
};
export { format, generateUpdateExpression };
//# sourceMappingURL=index.d.ts.map