exports.getTailIndexOfStraight = function(arr) {
  const straightMatcher = '11111';
  const cardsAsString = arr.join('');
  const headOfStraight = cardsAsString.lastIndexOf(straightMatcher);

  if (headOfStraight !== -1) {
    return headOfStraight + straightMatcher.length - 1;
  }

  return headOfStraight;
}

exports.hasAtLeastFive = function(cards) {
  const numberOfCards = cards.reduce(function(count, item) {
    return count += item;
  }, 0);

  return numberOfCards >= 5;
}

exports.or = function(first, second) {
  return first | second;
}

exports.add = function(first, second) {
  return first + second;
}

exports.flattenWithOperator = function(mat, operator) {
  const flattenedMatrix = [];

  for (let i = 0; i < mat[0].length; i++) {
    flattenedMatrix.push(0);
    for (let j = 0; j < mat.length; j++) {
      flattenedMatrix[i] = operator(flattenedMatrix[i], mat[j][i]);
    }
  }

  return flattenedMatrix;
}

exports.cardsWithAcesAtFrontAndBack = function(cards) {
  return cards.slice(0).map(function(faces) {
    const facesCopy = faces.slice(0);

    facesCopy.unshift(faces[faces.length - 1]);

    return facesCopy;
  });
}

// use for a matrix of already flattened cards
exports.getKicker = function(cards) {
  let flattened = cards;

  if (cards[0] instanceof Array) {
    flattened = exports.flattenWithOperator(cards, exports.or);
  }

  let kicker = -1;

  for (let i = flattened.length - 1; i >= 0; i--) {
    if (flattened[i] > 0) {
      kicker = i;

      break;
    }
  }

  return kicker;
}
