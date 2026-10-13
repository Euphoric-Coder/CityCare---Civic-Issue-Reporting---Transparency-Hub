"use client";

const PASSWORD_RECOVERY_KEY = "citycare_password_recovery";

/**
 * Validates a persisted password recovery object.
 *
 * Supported states:
 *
 * OTP pending:
 * {
 *   stage: "otp_pending",
 *   requestId,
 *   maskedDeliveryEmail,
 *   officerRole,
 *   expiresAt,
 *   resendAllowedAt
 * }
 *
 * OTP verified:
 * {
 *   stage: "otp_verified",
 *   resetSessionToken,
 *   resetSessionExpiresAt
 * }
 */
function isValidPasswordRecoveryState(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (value.stage === "otp_pending") {
    return (
      typeof value.requestId === "string" &&
      typeof value.maskedDeliveryEmail === "string" &&
      (value.officerRole === "unit_officer" ||
        value.officerRole === "field_officer") &&
      typeof value.expiresAt === "number" &&
      Number.isFinite(value.expiresAt) &&
      typeof value.resendAllowedAt === "number" &&
      Number.isFinite(value.resendAllowedAt)
    );
  }

  if (value.stage === "otp_verified") {
    return (
      typeof value.resetSessionToken === "string" &&
      typeof value.resetSessionExpiresAt === "number" &&
      Number.isFinite(value.resetSessionExpiresAt)
    );
  }

  return false;
}

/**
 * Returns whether browser sessionStorage is available.
 */
function canUseSessionStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.sessionStorage !== "undefined"
  );
}

/**
 * Persists the current password recovery state
 * for the current browser session.
 */
export async function savePasswordRecoveryState(state) {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    const serialized = JSON.stringify(state);

    sessionStorage.setItem(PASSWORD_RECOVERY_KEY, serialized);
  } catch (error) {
    console.error("Failed to save password recovery state:", error);
  }
}

/**
 * Retrieves and validates the persisted password recovery state.
 */
export async function getPasswordRecoveryState() {
  if (!canUseSessionStorage()) {
    return null;
  }

  try {
    const serialized = sessionStorage.getItem(PASSWORD_RECOVERY_KEY);

    if (!serialized) {
      return null;
    }

    const parsed = JSON.parse(serialized);

    if (!isValidPasswordRecoveryState(parsed)) {
      await clearPasswordRecoveryState();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to read or parse password recovery state:", error);

    await clearPasswordRecoveryState();

    return null;
  }
}

/**
 * Clears the persisted password recovery state.
 */
export async function clearPasswordRecoveryState() {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    sessionStorage.removeItem(PASSWORD_RECOVERY_KEY);
  } catch (error) {
    console.error("Failed to clear password recovery state:", error);
  }
}
