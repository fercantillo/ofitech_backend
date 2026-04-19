/** Quita campos internos de Mongo para devolver el mismo shape que los JSON. */
function toApiShape(doc) {
    if (doc == null) {
        return doc;
    }
    const { _id, __v, ...rest } = doc;
    return rest;
}

function toApiShapeList(docs) {
    return docs.map(toApiShape);
}

module.exports = { toApiShape, toApiShapeList };
