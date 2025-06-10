# Caching

## Read Query

This requires a complete query. If we need to read only part of the data, use `readFragment` instead.

```ts
const cache = client.readQuery({
  query: GET_CHARACTER,
  variables: {
    characterId: '1',
  },
});
```

## Write Qeury

Use writeQuery when you want to replace or insert a full query result into the cache, typically after:

- A mutation that changes the data of a known query (e.g. getUser).
- Manually setting up initial cache state.
- Restoring cache from server or localStorage.

```ts
client.writeQuery({
  query: gql`
    query WriteCharacter($id: Int!) {
      character(id: $id) {
        name
        hello
      }
    }
  `,
  data: {
    // Contains the data to write
    // note that I don't have to write a full data fields here
    // it will merge with the existing cache
    character: {
      __typename: 'Character',
      id: 5,
      name: 'Huy Trinh',
      hello: 'world', // this is not part of my schema
    },
  },
  variables: {
    id: 5,
  },
});
```

- The shape of your query is not enforced by your GraphQL server's schema:
  - The query can include fields that are not present in your schema.
  - You can (but usually shouldn't) provide values for schema fields that are invalid according to your schema.

## Read Fragment

```ts
const data = client.readFragment({
  id: 'Character:1',
  fragment: gql`
    fragment CharacterFragment on Character {
      name
    }
  `,
});
```

This will return `null` in either of the following cases:

- There is no cached `Todo` object with ID `5`
- There is a cached `Todo`object with ID `5`, but it's missing a value for a field

## Write Fragment

Difference from `writeQuery`: `writeFragment` does not update the cache under the **ROOT_QUERY** entry. It only updates normalized entity records by ID.

```ts
client.writeFragment({
  id: 'Character:5',
  fragment: gql`
    fragment MyCharacter on Character {
      name
    }
  `,
  data: {
    name: 'Huy Trinh',
  },
});
```

## Update Query / Fragment

If you want to read from cache and update the cache, use `updateQuery`

Silly example, I update all the name to `Huy`. So instead of calling `readQuery` and `writeQuery`

```ts
client.cache.updateQuery({query: GET_CHARACTERS}, data => {
  // return a value that replaces the cache
  return {
    characters: {
      results: data.characters.results.map(char => ({...char, name: 'Huy'})),
    },
  };
});
```

## Cache Modify

- It cannot write fields that do not already exist in the cache.
- It uses the custom merge functions we define

```ts
client.cache.modify({
  id: 'Character:1',
  fields: {
    name(cachedName) {
      return cachedName.toUpperCase();
    },
  },
});
```

Better to use the `cache.identify` for the ID.

If the field is an object, it will return the `ref` instead of the `value`

```ts
cache.modify({
  id: cache.identify(myPost),
  fields: {
    comments(existingCommentRefs, {readField}) {
      return existingCommentRefs.filter(commentRef => idToRemove !== readField('id', commentRef));
    },
  },
});
```

Example of Adding an item to a list

```ts
const newComment = {
  __typename: 'Comment',
  id: 'abc123',
  text: 'Great blog post!',
};

cache.modify({
  id: cache.identify(myPost),
  fields: {
    comments(existingCommentRefs = [], {readField}) {
      const newCommentRef = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment NewComment on Comment {
            id
            text
          }
        `,
      });

      // Quick safety check - if the new comment is already
      // present in the cache, we don't need to add it again.
      if (existingCommentRefs.some(ref => readField('id', ref) === newComment.id)) {
        return existingCommentRefs;
      }

      return [...existingCommentRefs, newCommentRef];
    },
  },
});
```

# Customize cache behaviour

## Read function

If you define a read function for a field, the cache calls that function whenever your client queries for the field. In the query response, the field is populated with the read function's return value, instead of the field's cached value.

```ts
const cache = new InMemoryCache({
  typePolicies: {
    Person: {
      fields: {
        name: {
          read(name, {args}) {
            // Return the cached name, transformed to upper case
            return name.toUpperCase();
          },
        },
      },
    },
  },
});
```

## Merge function

👉 Merge array field

A common use case for a `merge`function is to define how to write to a filed that **holds an array**. By default, the field's existing array is completely replaced by the incoming array. Some cases, it're preferable to concatenate the two arrays

```ts
const cache = new InMemoryCache({
  typePolicies: {
    Agenda: {
      fields: {
        tasks: {
          merge(existing = [], incoming: any[]) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});
```

👉 Merge non-normalized object

```ts
const cache = new InMemoryCache({
  typePolicies: {
    Book: {
      fields: {
        author: {
          // Non-normalized Author object within Book
          merge(existing, incoming, {mergeObjects}) {
            return mergeObjects(existing, incoming);
          },
        },
      },
    },
  },
});
```

Example is that the `Author` of the `Book` has no id, thus, we cannot normalize the `Author`

```ts
type Book {
  id: ID!
  title: String!
  author: Author!
}

type Author { # Has no key fields
  name: String!
  dateOfBirth: String!
}
```

And if we have 2 queries, Apollo have no idea that the **author** is the same

```ts
query BookWithAuthorName {
  favoriteBook {
    id
    author {
      name
    }
  }
}

query BookWithAuthorBirthdate {
  favoriteBook {
    id
    author {
      dateOfBirth
    }
  }
}
```

Thus, it will just replace the first author object with the second.

```ts

// first result
{
  "__typename": "Book",
  "id": "abc123",
  "author": {
    "__typename": "Author",
    👉 "name": "George Eliot"
  }
}

// second result
{
  "__typename": "Book",
  "id": "abc123",
  "author": {
    "__typename": "Author",
    👉 "dateOfBirth": "1819-11-22"
  }
}
```

Now we can ask it to merge these objects

```ts
const cache = new InMemoryCache({
  typePolicies: {
    Book: {
      fields: {
        author: {
          merge(existing, incoming, {mergeObjects}) {
            return mergeObjects(existing, incoming);
          },
        },
      },
    },
  },
});
```

Or here is the shorthand syntax

```ts
const cache = new InMemoryCache({
  typePolicies: {
    Book: {
      fields: {
        author: {
          // Equivalent to options.mergeObjects(existing, incoming).
          merge: true,
        },
      },
    },
  },
});
```

## Key arguments

If a field accepts arguments, we can specify an array of `keyArgs`. This array indicates which arguments are key arguments that affect the field's return value. It helps reduce the amount of duplicate data in the cache.

Here, only the argument `number` would affect the query result

```ts
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        monthForNumber: {
          keyArgs: ['number'],
        },
      },
    },
  },
});
```

# Pagination

## Basic

We need to do 2 things here

- Call the function `fetchMore` to fetch the next page of results
- Merge individual pages of results into a single list in the cache

If we don't update a field policy, the cache key would look like so

```ts
// ROOT QUERY
charecters({"page" : 1}): {}
charecters({"page" : 2}): {}
charecters({"page" : 3}): {}
```

However, we want those pagse to be merged. But the cache doesn't know that! We need to tell the cache not to store separate results for the `charecters` field based on the values of `page`. Let's define a cache policy.

```ts
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: {
          // Don't cache separate results based on
          // any of this field's arguments.
          keyArgs: false,

          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});
```

## With `no-cache`fetch

When you have queries that use a `no-cache` policy, data is not written to the cache, so field policies have no effect.

In this case, we need to use `updateQuery` function

```ts
fetchMore({
  variables: {offset: data.feed.length},
  updateQuery(previousData, {fetchMoreResult, variables: {offset}}) {
    // Slicing is necessary because the existing data is
    // immutable, and frozen in development.
    const updatedFeed = previousData.feed.slice(0);
    for (let i = 0; i < fetchMoreResult.feed.length; ++i) {
      updatedFeed[offset + i] = fetchMoreResult.feed[i];
    }
    return {...previousData, feed: updatedFeed};
  },
});
```

## Offset-based pagination

There is a util function

```ts
import {offsetLimitPagination} from '@apollo/client/utilities';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: offsetLimitPagination(),
      },
    },
  },
});
```
