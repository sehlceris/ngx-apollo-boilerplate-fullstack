# git: skip updating of sample config json

```
git update-index --skip-worktree config/development.json
git update-index --no-skip-worktree config/development.json
git ls-files -v . | grep ^S
```
