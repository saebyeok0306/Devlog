# Devlog Front-end

참고자료 https://github.com/velopert/velog


## jsconfig.json

```
{
    "compilerOptions": {
        "baseUrl": "src",
        "paths": {
            "api/*": ["api/*"],
            "components/*": ["components/*"],
            "containers/*": ["containers/*"],
            "assets/*": ["assets/*"],
            "pages/*": ["pages/*"],
            "recoil/*": ["recoil/*"],
            "routes/*": ["routes/*"]
        }
    },
    "include": ["src"]
}
```