import { cloneDeep } from "lodash";
import { ShexShapeAssociation } from "../shape";
import shapeTerms from './../shape-terms.json'

export class DataUtils {

  public static toTitleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

  public static genTermLookupTable() {
    const result = {};
    shapeTerms.forEach((term) => {
      result[term.id] = term
    })

    return result;
  }

  public static getPredicates(shapes: ShexShapeAssociation[], subjectIds?: string[], objectIds?: string[]): string[] {
    const matchedPredicates = new Set<string>();

    // If neither subjectIds nor objectIds is provided, return all predicates
    if (!subjectIds && !objectIds) {
      shapes.forEach((shape) => {
        matchedPredicates.add(shape.predicate);
      });
      return [...matchedPredicates];
    }

    shapes.forEach((shape) => {
      const subjectMatch = !subjectIds || subjectIds.length === 0 || subjectIds.includes(shape.subject);
      const objectMatch = !objectIds || objectIds.length === 0 || shape.object.some(objId => objectIds.includes(objId));

      if (subjectMatch && objectMatch) {
        matchedPredicates.add(shape.predicate);
      }
    });

    return [...matchedPredicates];
  }

  public static getObjects(shapes: ShexShapeAssociation[], subjectIds: string[]): string[] {
    const objectsSet = new Set<string>();

    shapes.forEach(shape => {
      if (subjectIds.includes(shape.subject)) {
        shape.object.forEach(obj => objectsSet.add(obj));
      }
    });

    return [...objectsSet];
  }


  public static getSubjectShapes(shapes: ShexShapeAssociation[], subjectId, excludeFromExtensions = true): ShexShapeAssociation[] {
    return shapes.filter(shape => {
      if (!excludeFromExtensions) {
        return shape.subject === subjectId
      }
      return shape.subject === subjectId && !shape.exclude_from_extensions;
    });
  }

  public static getRangeBySubject(shapes: ShexShapeAssociation[], subjectId: string, predicateId: string): ShexShapeAssociation {
    return shapes.find(shape => {
      return shape.subject === subjectId &&
        shape.predicate === predicateId &&
        !shape.exclude_from_extensions;
    });
  }

  public static getRangeLabels(shapes: ShexShapeAssociation[], lookupTable): string[] {
    const predicates = shapes.map((shape) => {
      const range = shape.object.map((term) => {
        return lookupTable[term]?.label;
      })

      const result = cloneDeep(lookupTable[shape.predicate])
      result['rangeLabel'] = range.join(', ');

      return result;
    });

    return predicates;
  }
}