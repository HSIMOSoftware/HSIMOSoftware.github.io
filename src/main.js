import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';
import {run} from '@cycle/xstream-run';
import {hr, a, pre, div, abbr, header, h1, h2, makeDOMDriver} from '@cycle/dom';

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

function createEmail(description) {
  if (description) {
    return div([
             pre(description),
             a({attrs: {href: encodeURI('mailto:info@hsimosoftware.com?subject=A project&body=' + description)}}, 'Send this email')
           ]);
  }
  else {
    return div([pre('Please start typing...')]);
  }
}

function intent(domSource, keypress) {
  const fullName = domSource.select('.name');
  const revealAcronym$ = xs.merge(
    fullName.events('mousemove').map(closeToCenter),
    fullName.events('touchstart').mapTo(1.0),
    fullName.events('mouseout').mapTo(0.0),
    fullName.events('touchend').mapTo(0.0)
    ).startWith(0.0);

  return {
    revealAcronym$: revealAcronym$,
    showDescription$: keypress.mapTo(1).fold((acc, x) => acc + x, 0)
  }
}

function model(actions) {
  const acronym$ = actions.revealAcronym$.map(selectAcronym);
  const description$ = actions.showDescription$.map(chars =>
`Greetings to the fine folk at HSIMO Software,

I understand that you're picky about the
projects you work on, but I have one that
I think you might find interesting.

Here are a few of the details:`
.slice(0, chars));

  return xs.combine(acronym$, description$).map(([a, d]) => {
    return {
      acronym: a,
      description: d
    }
  });
}

function view(state$) {
  return state$.map(({acronym, description}) =>
    div([
      header([
        h1([abbr('.name', {attrs: {title: acronym}}, 'HSIMO'), ' Software, LLC']),
        h2(acronym)
      ]),
      hr(),
      createEmail(description)
    ])
  );
}

function main(sources) {
  return {DOM: view(model(intent(sources.DOM, sources.Keypress)))};
}

run(main, {
  DOM: makeDOMDriver('#experiment'),
  Keypress: () => fromEvent(document, 'keypress').map(ev => ev.key)
});
