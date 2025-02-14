# @mxvincent/query-string

This package is an implementation of `@mxvincent/query` for rest api using query string to pass query options.

## 1. Filter

Use `filter` keyword to filter the dataset.

```bash
# get resources for which the id is 1 or 2
curl https://api.tld/resource?filter=in(id,1,2)
```

## 2. Sort

Use `sort` keyword to sort the dataset.

```bash
# ascendant sort on `id` path
curl https://api.tld/resource?sort=asc(id)
```

## 3. Paginate

Use `size` keyword to define the number of elements you want.

```bash
# get 10 records after cursor
curl https://api.tld/resource?size=10
```

Use `after` or `before` keyword to define from which element you want the data.

```bash
# get 10 records after cursor
curl https://api.tld/resource?size=10&after=opaque-cursor

# get 10 records before cursor
curl https://api.tld/resource?size=10&before=opaque-cursor
```
