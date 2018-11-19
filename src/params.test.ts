
import test from 'ava';
import { parseParams } from './params';


test('No params', t => {
    t.deepEqual(parseParams('No params'), [], 'no params');
})

test('No params 100%%', t => {
    t.deepEqual(parseParams('No params 100%%'), [], 'no params %');
})

test('Hello %s', t => {
    t.deepEqual(parseParams('Hello %s'), [{ name: 'p1', type: ['string'] }], 'one param');
})

test('Hello %1$s, %s', t => {
    t.deepEqual(parseParams('Hello %1$s, %s'), [{ name: 'p1', type: ['string'] }], 'one param');
})

test('Hello %1$s, %s, %2$s', t => {
    t.deepEqual(parseParams('Hello %1$s, %s, %2$s'),
        [{ name: 'p1', type: ['string'] }, { name: 'p2', type: ['string'] }],
        'one param');
})

test('Hello %1$s, %s, %2$s, %s', t => {
    t.deepEqual(parseParams('Hello %1$s, %s, %2$s, %s'),
        [{ name: 'p1', type: ['string'] }, { name: 'p2', type: ['string'] }],
        'one param');
})

test('Hello %d', t => {
    t.deepEqual(parseParams('Hello %d'),
        [{ name: 'p1', type: ['number'] }],
        'one param');
})

test('Hello %1$s, %s, %d', t => {
    t.deepEqual(parseParams('Hello %1$s, %s, %d'),
        [{ name: 'p1', type: ['string'] }, { name: 'p2', type: ['number'] }],
        'one param');
})

test('Hello %(name)s', t => {
    t.deepEqual(parseParams('Hello %(name)s'),
        [{ name: 'p1', type: ['{ name: string }'] }],
        'data param 1');
})

test('Hello %(name)s, %s', t => {
    t.deepEqual(parseParams('Hello %(name)s, %s'),
        [{ name: 'p1', type: ['string'] }, { name: 'p2', type: ['{ name: string }'] }],
        'data param 2');
})

test('Hello %(name)s, %s, %(age)d', t => {
    t.deepEqual(parseParams('Hello %(name)s, %s, %(age)d'),
        [{ name: 'p1', type: ['string'] }, { name: 'p2', type: ['{ name: string; age: number }'] }],
        'data param 3');
})
