# PromptX – Changelog

This file documents the major changes and improvements made to PromptX during development.

## [Milestone 2] – November 2026

### Added
- Implemented MVNet-based prompt injection detection using word-level and character-level features.
- Added a Policy Engine to identify suspicious instructions using predefined security rules.
- Implemented Risk Fusion to combine model and policy signals.
- Integrated fine-tuned RoBERTa for secondary verification of suspicious prompts.
- Added a 30% risk threshold for triggering secondary model verification.
- Implemented PDF text extraction and text preprocessing.
- Integrated Llama 3.2 3B Instruct for response generation.
- Added input handling and output handling modules.
- Created three prompt versions (V1, V2 and V3) and a final prompt design.
- Added safe, malicious and edge-case test datasets.
- Added system architecture and processing workflow diagrams.
- Added sample system output records.

### Testing
- Conducted testing using 10 input prompts.
- Recorded 8 PASS cases and 2 FAIL cases.
- Observed false positives involving an educational prompt-injection example and a binary search question.
- Documented model risk scores, policy scores, secondary verification results and processing times.

### Documentation
- Updated project documentation and repository structure.
- Added architecture and workflow diagrams.
- Prepared testing screenshots and sample results for project evaluation.

### Known Limitations
- Some harmless inputs may be incorrectly classified as malicious.
- Processing time can be high for certain inputs.
- Contextual understanding of quoted malicious instructions needs improvement.
- Some generated responses may be incomplete.

## [Milestone 1] – Initial Version

### Initial Development
- Identified prompt injection and sensitive data leakage as the primary problem.
- Defined the objective of building an AI security gateway.
- Established the initial prompt-based approach for detecting malicious instructions.
- Defined SAFE/MALICIOUS classification, risk scoring and ALLOW/BLOCK recommendations.
- Identified AI applications, cybersecurity teams and organizations as target users.