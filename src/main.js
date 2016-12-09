import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {header, h1, h2, span, makeDOMDriver} from '@cycle/dom';

function closeToCenter(ev) {
  const clientRect = ev.currentTarget.getBoundingClientRect();
  const center = (clientRect.right - clientRect.left) / 2;
  const position = ev.clientX - clientRect.left;
  const distanceFromCenter = Math.abs(center - position);
  const halfWidth = clientRect.width / 2;
  const distanceTowardCenter = halfWidth - distanceFromCenter;
  const howClose = distanceTowardCenter / halfWidth;
  return howClose;
}

function selectAcronym(accuracy) {
  const potentialAcronyms = [
      '',
      'Hello, Someone Is Missing Olives',
      'Hug Successful, Intelligent, Magnanimous Others',
      'Handsome Sailors Imagine Miraculous Oilskins',
      'Help Scream Incoherent Medical Oaths',
      'Highly Specific Information Modification and Organization',
      'Highly Specific Information Modification and Organization',
      'Highly Specific Information Modification and Organization',
    ];
  return potentialAcronyms[Math.round(accuracy * (potentialAcronyms.length - 1))];
}

function intent(domSource) {
  const fullName = domSource.select('.name');
  const revealAcronym$ = xs.merge(
    fullName.events('mousemove').map(closeToCenter),
    fullName.events('touchstart').mapTo(1.0),
    fullName.events('mouseout').mapTo(0.0),
    fullName.events('touchend').mapTo(0.0)
    ).startWith(0.0);

  return {
    revealAcronym$: revealAcronym$,
  }
}

function model(actions) {
  const acronym$ = actions.revealAcronym$.map(selectAcronym);

  return acronym$.map(a => {
    return {
      acronym: a
    }
  });
}

function view(state$) {
  return state$.map(({name, acronym}) =>
    header([
      h1([span('.name', 'HSIMO'), ' Software, LLC']),
      h2(acronym)
    ])
  );
}

function main(sources) {
  return {DOM: view(model(intent(sources.DOM)))};
}

run(main, { DOM: makeDOMDriver('#experiment')});
