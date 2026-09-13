# TODO

- Render one registration consent card per published legal document after the host registration integration accepts multiple field descriptors or trusted custom field content. The current `createRegistrationField()` host contract consumes exactly one ordinary form-builder field and escapes its label, so this external module cannot inject the requested multi-card markup safely without a Cognis core contract change.
- Replace the consent popup's account-settings navigation with direct account deletion after Cognis exposes a user-scoped, revalidated delete-current-account UI capability. The current users API explicitly blocks self-deletion, so the module must not bypass mandatory account validation or call private authentication implementations.
