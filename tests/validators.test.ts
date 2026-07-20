import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  isValidEmail,
  isNonEmptyString,
  isStrongEnoughPassword,
} from '../src/utils/validators';

test('isValidEmail aceita e-mails válidos', () => {
  assert.equal(isValidEmail('ana.souza@example.com'), true);
  assert.equal(isValidEmail('  bruno.lima@example.com  '), true);
});

test('isValidEmail rejeita e-mails inválidos', () => {
  assert.equal(isValidEmail('nao-e-um-email'), false);
  assert.equal(isValidEmail('faltou@dominio'), false);
  assert.equal(isValidEmail(''), false);
});

test('isNonEmptyString valida strings não vazias', () => {
  assert.equal(isNonEmptyString('conteúdo'), true);
  assert.equal(isNonEmptyString('   '), false);
  assert.equal(isNonEmptyString(''), false);
  assert.equal(isNonEmptyString(123), false);
});

test('isNonEmptyString respeita o minLength informado', () => {
  assert.equal(isNonEmptyString('abc', 5), false);
  assert.equal(isNonEmptyString('abcde', 5), true);
});

test('isStrongEnoughPassword exige ao menos 6 caracteres', () => {
  assert.equal(isStrongEnoughPassword('123456'), true);
  assert.equal(isStrongEnoughPassword('12345'), false);
});
