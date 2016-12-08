import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {header, h1, h2, makeDOMDriver} from '@cycle/dom';

function intent(domSource) {
  const revealAcronym$ = xs.merge(
    domSource.select('.name').events('mouseover').mapTo(true),
    domSource.select('.name').events('touchstart').mapTo(true)
    );

  const hideAcronym$ = xs.merge(
    domSource.select('.name').events('mouseout').mapTo(true),
    domSource.select('.name').events('touchend').mapTo(true)
    );

  return {
    revealAcronym$: revealAcronym$,
    hideAcronym$: hideAcronym$
  }
}

function model(actions) {
    const acronymVisible$ = xs.merge(
        actions.revealAcronym$,
        actions.hideAcronym$.mapTo(false))
      .startWith(false);

  return acronymVisible$.map(v => {
    return {
      name: 'HSIMO Software, LLC',
      acronym: v ? 'Highly Specific Infomation Modification and Organization' : ''
    }
  });
}

function view(state$) {
  return state$.map(({name, acronym}) =>
    header([
      h1('.name', name),
      h2(acronym)
    ])
  );
}

function main(sources) {
  return {DOM: view(model(intent(sources.DOM)))};
}

run(main, { DOM: makeDOMDriver('#experiment')});
