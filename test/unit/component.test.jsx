import { component, dom } from '../../src';
import { requestAnimationFrame, requestIdleCallback } from '../utils';

window.requestAnimationFrame = requestAnimationFrame;
window.requestIdleCallback = requestIdleCallback;

describe('component tests', () => {
  let body;
  let middleware;
  let middlewareFn;

  beforeEach(() => {
    document.body.innerHTML = '';
    middlewareFn = jest.fn(x => x);
    middleware = () => () => middlewareFn;

    const template = state => actions => (
      <div>
        <span id="text">{state.text}</span>
        <button
          id="update"
          onclick={actions.update}
        />
        <button
          id="async"
          onclick={actions.asyncUpdate}
        />
        <div>
          <div>
            <div>
              <div>
                hey
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    component({
      template,
      state: {
        text: 'hello, world',
      },
      actions: {
        update: state => ({ text: `${state.text}!` }),
        asyncUpdate: state => (update) => {
          setTimeout(() => {
            update({ text: `${state.text}!!` });
          }, 50);
        },
      },
      middleware: [middleware],
    });

    body = document.body;
  });

  it('should properly render', (done) => {
    setTimeout(() => {
      expect(body.innerHTML).not.toEqual('');

      done();
    }, 50);
  });

  it('should properly render the state', (done) => {
    setTimeout(() => {
      expect(body.querySelector('#text').innerHTML).toEqual('hello, world');

      done();
    }, 50);
  });

  it('should properly handle an update action', (done) => {
    setTimeout(() => {
      body.querySelector('#update').click();

      setTimeout(() => {
        expect(body.querySelector('#text').innerHTML).toEqual('hello, world!');
        done();
      }, 25);
    }, 25);
  });

  it('should handle a thunk', (done) => {
    setTimeout(() => {
      body.querySelector('#async').click();

      setTimeout(() => {
        expect(body.querySelector('#text').innerHTML).toEqual('hello, world!!');
        done();
      }, 100);
    }, 25);
  });

  it('should support middleware', (done) => {
    setTimeout(() => {
      body.querySelector('#update').click();
      setTimeout(() => {
        expect(middlewareFn).toHaveBeenCalled();
        done();
      }, 25);
    }, 25);
  });
});