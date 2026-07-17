import { telemetryPayloadSchema } from '../src/validators/telemetry.validator';
import { statusPayloadSchema } from '../src/validators/status.validator';
import { eventPayloadSchema } from '../src/validators/event.validator';
import { commandPayloadSchema } from '../src/validators/command.validator';

const runTests = () => {
  console.log('=== RUNNING ZOD VALIDATOR TESTS ===\n');

  let passed = true;

  // Helper to assert success
  const assertSuccess = (name: string, schema: any, payload: any) => {
    const result = schema.safeParse(payload);
    if (result.success) {
      console.log(`[PASS] ${name}`);
    } else {
      console.error(`[FAIL] ${name}`);
      console.error('Expected success but got errors:', result.error.errors.map((e: any) => e.message));
      passed = false;
    }
  };

  // Helper to assert failure
  const assertFailure = (name: string, schema: any, payload: any, expectedErrors: string[]) => {
    const result = schema.safeParse(payload);
    if (!result.success) {
      const messages = result.error.errors.map((e: any) => e.message);
      const allMatched = expectedErrors.every((expected) =>
        messages.some((msg: string) => msg.includes(expected))
      );
      if (allMatched) {
        console.log(`[PASS] ${name}`);
      } else {
        console.error(`[FAIL] ${name}`);
        console.error('Expected errors to contain:', expectedErrors);
        console.error('But got:', messages);
        passed = false;
      }
    } else {
      console.error(`[FAIL] ${name}`);
      console.error('Expected validation failure, but it succeeded.');
      passed = false;
    }
  };

  // 1. Telemetry Tests
  assertSuccess('Telemetry: Valid Minimal Payload', telemetryPayloadSchema, {
    deviceId: 'panel001',
    temperature: 42,
    voltage: 18.5,
  });

  assertSuccess('Telemetry: Valid Full Payload', telemetryPayloadSchema, {
    deviceId: 'panel001',
    temperature: 42.5,
    voltage: 18.7,
    current: 2.31,
    power: 43.19,
    dust: 210,
    humidity: 60,
    pumpStatus: true,
    wiperStatus: false,
    mode: 'AUTO',
    timestamp: '2026-07-10T20:30:00Z',
  });

  assertFailure(
    'Telemetry: Invalid Payload (string temperature)',
    telemetryPayloadSchema,
    {
      temperature: '42',
    },
    ['temperature must be number', 'deviceId is required', 'voltage is required']
  );

  // 2. Status Tests
  assertSuccess('Status: Valid ONLINE Payload', statusPayloadSchema, {
    deviceId: 'panel001',
    status: 'ONLINE',
    timestamp: '2026-07-10T20:30:00Z',
  });

  assertFailure(
    'Status: Invalid Status Value',
    statusPayloadSchema,
    {
      deviceId: 'panel001',
      status: 'UNKNOWN',
    },
    ['status must be ONLINE or OFFLINE']
  );

  // 3. Event Tests
  assertSuccess('Event: Valid Event Payload', eventPayloadSchema, {
    deviceId: 'panel001',
    event: 'Temperature exceeds threshold!',
  });

  assertFailure(
    'Event: Missing Event Field',
    eventPayloadSchema,
    {
      deviceId: 'panel001',
    },
    ['event description is required']
  );

  // 4. Command Tests
  assertSuccess('Command: Valid PUMP_ON Command', commandPayloadSchema, {
    deviceId: 'panel001',
    command: 'PUMP_ON',
  });

  assertFailure(
    'Command: Invalid Command Value',
    commandPayloadSchema,
    {
      deviceId: 'panel001',
      command: 'INVALID_ACTION',
    },
    ['command must be one of:']
  );

  console.log('\n==================================');
  if (passed) {
    console.log('🎉 ALL VALIDATOR TESTS PASSED!');
    process.exit(0);
  } else {
    console.error('❌ SOME VALIDATOR TESTS FAILED!');
    process.exit(1);
  }
};

runTests();
