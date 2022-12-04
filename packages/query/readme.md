# @mxvincent/query

API resources should be paged as the number of records increases. The concept of pagination does not come alone. To get
a subset of a resource, the data can be filtered, ordered and paginated.

> 👉 Operation order is `Filter` > `Sort` > `Paginate`

This package provides an implementation of these three concepts.

# Specification

## 1. Filter

To filter data you should use the `filter` keyword in your query string.

You can search on any path of the document.

Query can be composed with many filters.

Filters use a function like syntax `eq(path,value)`.

### 1.1 Comparison operators

We can use operator to filter data with logical comparison.

Filter path can be used with to build object filters. In this case you can use a reducer in your server side code to
rebuild object from filter parameters.

| Operator | Description                                              | Arguments       |
|----------|:---------------------------------------------------------|-----------------|
| `eq`     | Must be equal to the value.                              | path, value     |
| `ne`     | Must be different from value.                            | path, value     |
| `gt`     | Must be greater than value.                              | path, value     |
| `gte`    | Should be greater or equal than value.                   | path, value     |
| `lt`     | Should be less than value.                               | path, value     |
| `lte`    | Should be less than or equal  value.                     | path, value     |
| `in`     | Must be equal to one of the values.                      | path, ...values |
| `nin`    | Must be different from all values.                       | path, ...values |
| `like`   | Pattern matching in strings. Use SQL format.             | path, value     |
| `nlike`  | Negated version of the like operator.                    | path, value     |
| `regex`  | Must match regex.                                        | path, pattern   |
| `match`  | Get records for which pattern matches.                   | path, pattern   |
| `imatch` | Get records for which pattern matches. Case insensitive. | path, pattern   |
| `null`   | Get records for which this value is null.                | path            |

### 1.2 Logical operators

When the query contains more than one filter, you can define by what type of logical relationship they are linked.

Logical filter is not mandatory. Implicitly the default logical relationship is a logical `and`:

| Operator | Description                                       |
|:---------|:--------------------------------------------------|
| `and`    | All filters constraints should be satisfied.      | 
| `or`     | One of the filter constraint should be satisfied. | 

To add logical comparison, you need to wrap the value with an operator using parenthesis.

### 1.3 Formats

> Dates values should follow the [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601#Date_et_heure) spec.

## 2. Sort

You can sort data using the `sort` keyword in the query-string.

> getAllCustomParams() helper only return the first sortableKeys parameter

### 2.1 Sort order

By default, the sort is ascendant.

If you need to specify the sort order, you can use a sort direction. Sort operators use the same syntax as the filter
operators.

| Direction | Description                                    | Comment               |
|:----------|:-----------------------------------------------|:----------------------|
| `asc`     | Starting from the lowest value to the highest. | Is default direction. |
| `desc`    | Starting from the highest value to the lowest. |                       |

```bash
# sortableKeys data by date from older to newer
curl https://api.tld/resource?sortableKeys=date

# sortableKeys data by date from newer to older
curl https://api.tld/resource?sortableKeys=desc(date)
```

## 3. Pagination

Pagination can be useful if you don't need the entire data set.

Pagination uses two concepts: slicing and sizing. Those concepts will be used to query a specific part of the entire
data set.

| Keyword  | Type             | Description                | Concept |
|:---------|:-----------------|:---------------------------|:--------|
| `after`  | string           | Get records after cursor.  | slicing |
| `before` | string           | Get records before cursor. | slicing |
| `size`   | unsigned integer | Get n records.             | sizing  |

### 3.2 Slicing

If you do not provide slicing parameter, the first item of the result will be the first item of the data set.

Slicing define the first element of the subset. Slicing use opaques cursors. When you paginate data, a cursor is
returned. You can use the cursor to define the first record of tour next request.

```bash
# get 10 records after cursor
curl https://api.tld/resource?after=eyJsYXs&first=10
```

### 3.3 Direction `forward` vs `backward`

Pagination can be `forward` or `backward`

Take n elements after an optional cursor with `forward` pagination.

```bash
# get 10 first records
curl https://api.tld/resource?first=10

# get 10 records after cursor
curl https://api.tld/resource?first=10&after=opaque-cursor
```

Take n elements before a required cursor with `backward` pagination.

```bash
# get 10 records before cursor
curl https://api.tld/resource?last=10&before=opaque-cursor
```

