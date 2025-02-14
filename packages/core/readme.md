```shell
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:4096

```

```shell
openssl rsa -pubout -in private_key.pem -out public_key.pem

```
