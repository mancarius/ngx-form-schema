<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Test][test-shield]][test-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/mancarius/ngx-form-schema">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Ngx Form Schema</h3>

  <p align="center">
    A simple extension of Angular's form that adds control management through schema.
    <br />
    <a href="https://github.com/mancarius/ngx-form-schema"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
    ·
    <a href="https://github.com/mancarius/ngx-form-schema/issues">Report Bug</a>
    ·
    <a href="https://github.com/mancarius/ngx-form-schema/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-for">Built For</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The Form Schema library was born out of the need to easily manage the fields of a form through a schema while allowing maximum freedom in implementing the GUI.

This project is currently in beta version, therefore it is not yet ready for production.

### Features

-

### Built For

- [Angular@15](https://angular.io)

<!-- GETTING STARTED -->

## Getting Started

IMPORTANT: This project is currently in beta version, therefore it is not yet ready for production.

### Prerequisites

This library needs the following packages: `rxjs` (_if not already installed_), `jsep` and `jse-eval`. so, before to install the library, install those packages.

- npm
  ```sh
  npm install rxjs@latest jsep@1.3 jse-eval@1.5
  ```

### Installation

To use Ngx Form Schema in your project simply execute the following command:

- npm
  ```sh
  npm install ngx-form-schema@latest --save
  ```

<!-- USAGE EXAMPLES -->

## Usage

This is how to create a control instance by a schema.
```ts
const control = new FormControlSchema<UserRoleType>({
  defaultValue: string | number | boolean | null,
  type: FormSchemaFieldType,
  key: string,
  label: string,
  placeholder?: string,
  hint?: string,
  readonly?: boolean,
  disabled?: boolean,
  disableWhenNotVisible?: boolean,
  size?: FormSchemaFieldSize,
  maxLength?: number,
  visible?: boolean,
  group?: string,
  options?: FormSchemaFieldOptions[] | Observable<FormSchemaFieldOptions[]>,
  order?: number,
  prefix?: string,
  dependencies?: string[],
  suffix?: string,
  permissions?: FormSchemaPermissionSettings<UserRoleType>,
  userRoles?: UserRoleType[],
  validators?: FormSchemaValidators,
  conditions?: FormSchemaConditions
}, ValidatorFn[]);
```

This is how to create a group of controls.
```ts
const groupBySchema = new FormGroupSchema<UserRoleType>({
  fields: {
    foo: fooControl,
    bar: barControl
  }
});
```

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/mancarius/ngx-form-schema/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/mancarius/ngx-form-schema](https://github.com/mancarius/ngx-form-schema)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/mancarius/ngx-form-schema.svg?style=for-the-badge
[contributors-url]: https://github.com/mancarius/ngx-form-schema/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mancarius/ngx-form-schema.svg?style=for-the-badge
[forks-url]: https://github.com/mancarius/ngx-form-schema/network/members
[stars-shield]: https://img.shields.io/github/stars/mancarius/ngx-form-schema.svg?style=for-the-badge
[stars-url]: https://github.com/mancarius/ngx-form-schema/stargazers
[issues-shield]: https://img.shields.io/github/issues/mancarius/ngx-form-schema.svg?style=for-the-badge
[issues-url]: https://github.com/mancarius/ngx-form-schema/issues
[license-shield]: https://img.shields.io/github/license/mancarius/ngx-form-schema.svg?style=for-the-badge
[license-url]: https://github.com/mancarius/ngx-form-schema/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/mattia-mancarella/
[product-screenshot]: images/screenshot.png
[test-shield]: https://github.com/mancarius/ngx-form-schema/actions/workflows/cd.yml/badge.svg
[test-url]: https://github.com/mancarius/ngx-form-schema/actions/workflows/cd.yml
