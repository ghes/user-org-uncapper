# user-org-uncapper

This userscript displays a user's public organizations beyond the 25 GitHub
now limits a user page to, as described in [isaacs/github#840][].

[isaacs/github#840]: https://github.com/isaacs/github/issues/840

## On displaying private organization membership

This app technically supports the [rudimentary authorization flow](https://github.com/ghes/ghes.github.io#using-httpsghesgithubioapioauth) for GitHub Enhancement Suite scripts. However, due to [the lousy way GitHub implements organization read access for OAuth applications](https://github.com/isaacs/github/issues/992), this will *most likely be unsatisfactory*, if you're in a position (like me) where you need to be able to read an ever-increasing list of private organizations.

You can come up with your own way to fix this: the way I do it is to go into the "Storage" tab of Tampermonkey and add a `"stuartpb access token"` line with a manually-generated [personal access token with `read:org` scope](https://github.com/settings/tokens), since personal access tokens *do* give full read access for private organization access. (Obviously, you'd want to replace `stuartpb` with your own username.)

## [License in Three Lines ![(LITL)](https://litl-license.org/logo.svg)][LITL]

[LITL]: https://litl-license.org

Copyright Stuart P. Bentley.<br>
This work may be used freely as long as this notice is included.<br>
The work is provided "as is" without warranty, express or implied.
