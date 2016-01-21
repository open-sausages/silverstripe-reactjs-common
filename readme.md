DEPRECATED: Do not use this library, it is no longer maintained. Some of these features will be available in SilverStripe core 4.0

# SilverStripe ReactJS Common

ReactJS Common exposes the required libraries and classes for building React components in SilverStripe CMS.

## Install

```
$ composer require silverstripe/reactjs-common
```

## Usage

Once you have the module installed, React and Flux are available throughout the CMS, and can be accessed through Browserify.

__./my-component/gulpfile.js__

```

    ...

    gulp.task('js', function () {
        browserify({
            entries: './public/src/main.js'
        })
        .external('react')
        .external('flux')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.dist));
    });

    ...

```

The lines with `.external()` tell Browserify to ignore places where `react` and `flux` are required in your app during bundling. When your code is executed in the browser, these dependencies will be loaded from the `reactjs-common` bundle file.

## Versioning

This library follows [Semver](http://semver.org). According to Semver, you will be able to upgrade to any minor or patch version of this library without any breaking changes to the public API. Semver also requires that we clearly define the public API for this library.

All methods, with `public` visibility, are part of the public API. All other methods are not part of the public API. Where possible, we'll try to keep `protected` methods backwards-compatible in minor/patch versions, but if you're overriding methods then please test your work before upgrading.

## Reporting Issues

Please [create an issue](http://github.com/open-sausages/silverstripe-reactjs-common/issues) for any bugs you've found, or features you're missing.
