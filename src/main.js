import {run} from '@cycle/xstream-run';
import {header, h1, h2, makeDOMDriver} from '@cycle/dom';

function main(sources) {
  const sinks = {
    DOM: sources.DOM.select('.name').events('mouseover')
      .map(() => "Highly Specific Infomation Modification and Organization")
      .startWith('')
      .map(name =>
        header([
          h1('.name', 'HSIMO Software, LLC'),
          h2(name)
        ])
      )
  };

  return sinks;
}

run(main, { DOM: makeDOMDriver('#experiment')});
