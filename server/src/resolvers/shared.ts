import { IGraphQLToolsResolveInfo } from "apollo-server-express";
import { fieldsList } from "graphql-fields-list";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ResponseStatus {
  @Field()
  success: boolean;
}

export const isFieldRequested = (
  field: string,
  info: IGraphQLToolsResolveInfo,
): boolean => fieldsList(info).includes(field);

export const getRelations = <T extends [string, string]>(
  fieldRelationTuple: T[],
) => (info: IGraphQLToolsResolveInfo): string[] | undefined => {
  const fields = fieldsList(info);

  const relations = fieldRelationTuple.reduce<string[]>(
    (acc, [field, relation]) =>
      fields.includes(field) ? [...acc, relation] : acc,
    [],
  );

  return relations.length > 0 ? relations : undefined;
};
